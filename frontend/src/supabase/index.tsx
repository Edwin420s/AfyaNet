import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Sign up new user
app.post('/make-server-0345afcc/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, role, institution, licenseNumber } = body;

    console.log('Creating new user:', { email, role });

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      email_confirm: true // Auto-confirm for demo purposes
    });

    if (authError) {
      console.error('Auth error during signup:', authError);
      return c.json({ error: authError.message }, 400);
    }

    if (!authData.user) {
      console.error('No user data returned from auth');
      return c.json({ error: 'Failed to create user' }, 400);
    }

    // Store additional user profile data
    const userProfile = {
      id: authData.user.id,
      email,
      name,
      role,
      institution: institution || null,
      licenseNumber: licenseNumber || null,
      createdAt: new Date().toISOString(),
      status: role === 'doctor' || role === 'hospital_admin' ? 'pending_verification' : 'active'
    };

    await kv.set(`user_profile:${authData.user.id}`, userProfile);
    
    // Create initial role-specific data
    if (role === 'patient') {
      await kv.set(`patient_records:${authData.user.id}`, {
        medicalTimeline: [],
        accessGrants: [],
        alerts: []
      });
    } else if (role === 'doctor') {
      await kv.set(`doctor_data:${authData.user.id}`, {
        patients: [],
        pendingRequests: [],
        prescriptions: []
      });
    }

    console.log('User created successfully:', userProfile);
    return c.json(userProfile);

  } catch (error) {
    console.error('Error during signup:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get user profile
app.get('/make-server-0345afcc/user-profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error('Auth error while fetching user profile:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (!profile) {
      console.error('No profile found for user:', user.id);
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json(profile);

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return c.json({ error: 'Internal server error while fetching profile' }, 500);
  }
});

// Patient endpoints
app.get('/make-server-0345afcc/patient/records', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const records = await kv.get(`patient_records:${user.id}`);
    return c.json(records || { medicalTimeline: [], accessGrants: [], alerts: [] });

  } catch (error) {
    console.error('Error fetching patient records:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-0345afcc/patient/grant-access', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { doctorId, accessType, duration } = await c.req.json();
    
    const records = await kv.get(`patient_records:${user.id}`) || { medicalTimeline: [], accessGrants: [], alerts: [] };
    
    const newGrant = {
      id: crypto.randomUUID(),
      doctorId,
      accessType,
      duration,
      grantedAt: new Date().toISOString(),
      status: 'active'
    };

    records.accessGrants.push(newGrant);
    await kv.set(`patient_records:${user.id}`, records);

    return c.json({ success: true, grant: newGrant });

  } catch (error) {
    console.error('Error granting access:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Doctor endpoints
app.get('/make-server-0345afcc/doctor/patients', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const doctorData = await kv.get(`doctor_data:${user.id}`);
    return c.json(doctorData || { patients: [], pendingRequests: [], prescriptions: [] });

  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/make-server-0345afcc/doctor/request-access', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { patientEmail, reason } = await c.req.json();
    
    // Find patient by email
    const profileKeys = await kv.getByPrefix('user_profile:');
    const patientProfile = profileKeys.find(profile => 
      profile.email === patientEmail && profile.role === 'patient'
    );

    if (!patientProfile) {
      return c.json({ error: 'Patient not found' }, 404);
    }

    // Add request to patient's alerts
    const patientRecords = await kv.get(`patient_records:${patientProfile.id}`) || 
      { medicalTimeline: [], accessGrants: [], alerts: [] };

    const doctorProfile = await kv.get(`user_profile:${user.id}`);
    
    const newAlert = {
      id: crypto.randomUUID(),
      type: 'access_request',
      from: doctorProfile.name,
      fromId: user.id,
      reason,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    patientRecords.alerts.push(newAlert);
    await kv.set(`patient_records:${patientProfile.id}`, patientRecords);

    return c.json({ success: true, message: 'Access request sent' });

  } catch (error) {
    console.error('Error requesting access:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Demo data endpoint
app.post('/make-server-0345afcc/seed-demo-data', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (profile.role === 'patient') {
      const demoRecords = {
        medicalTimeline: [
          {
            id: '1',
            date: '2024-01-15',
            type: 'Consultation',
            provider: 'Dr. Sarah Johnson',
            summary: 'Annual checkup - all vitals normal',
            documents: ['checkup-report.pdf']
          },
          {
            id: '2',
            date: '2024-02-20',
            type: 'Lab Results',
            provider: 'City Medical Lab',
            summary: 'Blood work - cholesterol slightly elevated',
            documents: ['lab-results-feb.pdf']
          },
          {
            id: '3',
            date: '2024-03-10',
            type: 'Prescription',
            provider: 'Dr. Sarah Johnson',
            summary: 'Prescribed statins for cholesterol management',
            documents: ['prescription-march.pdf']
          }
        ],
        accessGrants: [
          {
            id: '1',
            doctorId: 'demo-doctor-1',
            doctorName: 'Dr. Sarah Johnson',
            accessType: 'full',
            duration: '6 months',
            grantedAt: '2024-01-15T10:00:00Z',
            status: 'active'
          }
        ],
        alerts: [
          {
            id: '1',
            type: 'reminder',
            message: 'Time for your 6-month cholesterol follow-up',
            createdAt: '2024-08-01T09:00:00Z',
            status: 'unread'
          }
        ]
      };
      
      await kv.set(`patient_records:${user.id}`, demoRecords);
    }

    return c.json({ success: true, message: 'Demo data seeded' });

  } catch (error) {
    console.error('Error seeding demo data:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

Deno.serve(app.fetch);