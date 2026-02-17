
-- Add saving_percentage column to profiles table
alter table profiles 
add column saving_percentage integer default 0 check (saving_percentage >= 0 and saving_percentage <= 100);

-- Update the handle_new_user function if needed (e.g. initialize default value)
-- But since we set a default on the column, it's not strictly necessary to update the function.
-- Just ensure the new column is available.
