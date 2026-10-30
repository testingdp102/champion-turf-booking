-- =====================================
-- USERS TABLE
-- =====================================

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'user',
    mobile character varying(15),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

-- =====================================
-- TURFS TABLE
-- =====================================

CREATE TABLE IF NOT EXISTS public.turfs
(
    id integer NOT NULL DEFAULT nextval('turfs_id_seq'::regclass),
    turf_name character varying(100) NOT NULL,
    location character varying(255),
    price_per_hour numeric(10,2),
    CONSTRAINT turfs_pkey PRIMARY KEY (id)
);

-- =====================================
-- BOOKINGS TABLE
-- =====================================

CREATE TABLE IF NOT EXISTS public.bookings
(
    id integer NOT NULL DEFAULT nextval('bookings_id_seq'::regclass),
    user_id integer NOT NULL,
    booking_date date NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    total_amount numeric(10,2),
    status character varying(20) DEFAULT 'Booked',
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    cancellation_reason character varying(255),
    cancelled_at timestamp,
    CONSTRAINT bookings_pkey PRIMARY KEY (id),
    CONSTRAINT bookings_user_fk
        FOREIGN KEY (user_id)
        REFERENCES public.users(id)
        ON DELETE CASCADE
);