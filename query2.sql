SELECT u.email, u.name, array_to_string(u.roles, ',') as roles FROM "User" u WHERE 'ADMIN' = ANY(u.roles) LIMIT 3;
