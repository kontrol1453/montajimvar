SELECT u.email, u.name, array_to_string(u.roles, ',') FROM "User" u WHERE 'ADMIN' = ANY(u.roles);
