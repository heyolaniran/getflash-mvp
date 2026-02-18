
-- Record of users transactions 

create table sats_transactions (
    id uuid not null default gen_random_uuid() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    amount numeric not null,
    type text not null default 'received' check (type in ('received', 'sent', 'saved')),
    status text not null default 'pending' check (status in ('pending', 'success', 'failed')),
    payment_hash text not null,
    payment_secret text not null,
    external_transaction_id text not null,
    revealed_preimage text null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    
)




-- create table of stablesats transactions 

create table stablesats_transactions (
    id uuid not null default gen_random_uuid() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    amount numeric not null,
    type text not null default 'received' check (type in ('received', 'sent', 'saved')),
    status text not null default 'pending' check (status in ('pending', 'success', 'failed')),
    payment_hash text not null,
    payment_secret text not null,
    external_transaction_id text not null,
    revealed_preimage text null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
)
