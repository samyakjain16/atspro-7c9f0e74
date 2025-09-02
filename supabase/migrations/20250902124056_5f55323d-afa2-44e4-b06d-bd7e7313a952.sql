-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Jobs policies
CREATE POLICY "Users can view own jobs" ON jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own jobs" ON jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own jobs" ON jobs FOR DELETE USING (auth.uid() = user_id);

-- Candidates policies
CREATE POLICY "Users can view own candidates" ON candidates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own candidates" ON candidates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own candidates" ON candidates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own candidates" ON candidates FOR DELETE USING (auth.uid() = user_id);

-- Clients policies
CREATE POLICY "Users can view own clients" ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own clients" ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clients" ON clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clients" ON clients FOR DELETE USING (auth.uid() = user_id);

-- Applications policies
CREATE POLICY "Users can view applications for their jobs" ON applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = applications.job_id AND jobs.user_id = auth.uid())
);
CREATE POLICY "Users can create applications for their jobs" ON applications FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = applications.job_id AND jobs.user_id = auth.uid())
);
CREATE POLICY "Users can update applications for their jobs" ON applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = applications.job_id AND jobs.user_id = auth.uid())
);
CREATE POLICY "Users can delete applications for their jobs" ON applications FOR DELETE USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = applications.job_id AND jobs.user_id = auth.uid())
);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'recruiter');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();