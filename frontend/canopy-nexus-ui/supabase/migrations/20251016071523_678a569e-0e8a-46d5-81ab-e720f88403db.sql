-- Fix consultant_profiles RLS policies
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert profiles" ON consultant_profiles;
DROP POLICY IF EXISTS "Authenticated users can update profiles" ON consultant_profiles;

-- Only admins can insert new consultant profiles
CREATE POLICY "Admins can insert profiles"
ON consultant_profiles FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Only admins can update consultant profiles
CREATE POLICY "Admins can update profiles"
ON consultant_profiles FOR UPDATE
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Fix documents RLS policies
-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view documents" ON documents;

-- Users can view their own documents
CREATE POLICY "Users can view own documents"
ON documents FOR SELECT
USING (auth.uid() = uploaded_by);

-- Admins can view all documents
CREATE POLICY "Admins can view all documents"
ON documents FOR SELECT
USING (has_role(auth.uid(), 'admin'));