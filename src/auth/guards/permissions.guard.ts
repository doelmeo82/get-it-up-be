// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
// import type { Request } from 'express';
// import { PermissionOutput, RoleOutput } from '../dtos';

// @Injectable()
// export class PermissionsGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   public canActivate(context: ExecutionContext): boolean {
//     const permissions = this.reflector.getAllAndOverride<number[] | undefined>(
//       'permissions',
//       [
//         context.getHandler(), // Method Roles
//         context.getClass(), // Controller Roles
//       ],
//     );
//     if (!permissions) {
//       return true;
//     }

//     let request: Request;
//     if (context.getType<GqlContextType>() === 'graphql') {
//       const ctx = GqlExecutionContext.create(context).getContext();
//       request = <Request>ctx.req;
//     } else {
//       request = context.switchToHttp().getRequest<Request>();
//     }

//     const { user } = request;
//     if (!user) {
//       return false;
//     }
//     const userPermissions: PermissionOutput[] = user.roles.reduce(
//       (accumulator: PermissionOutput[], role: RoleOutput) => {
//         return [...accumulator, ...role.permissions];
//       },
//       [] as PermissionOutput[],
//     );
//     let permissionPermit = true;
//     if (permissions && userPermissions) {
//       permissionPermit = permissions.every((permission: number) =>
//         userPermissions
//           .map((userPermission: PermissionOutput) => userPermission.id)
//           .includes(permission),
//       );
//     }
//     return permissionPermit;
//   }
// }
