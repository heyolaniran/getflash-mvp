-- Add saving_percentage column to profiles table if it doesn't exist
do $$ 
begin
    if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='saving_percentage') then
        alter table profiles add column saving_percentage integer default 0 check (saving_percentage >= 0 and saving_percentage <= 100);
    end if;
end $$;

-- Update stablesats_transactions type check constraint
alter table stablesats_transactions 
drop constraint if exists stablesats_transactions_type_check;

alter table stablesats_transactions 
add constraint stablesats_transactions_type_check 
check (type in ('received', 'sent', 'saved'));