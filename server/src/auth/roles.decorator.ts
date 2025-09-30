import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
/**
 * Custom decorator @Roles(...)
 *
 * Usage: @Roles(UserRole.ADMIN)
 *
 * What it does:
 * - Uses Nest's SetMetadata helper to attach metadata ("roles") to
 *   the route handler or controller class.
 * - Later, RolesGuard will read this metadata using Reflector.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
