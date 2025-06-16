import { SetMetadata } from '@nestjs/common';
import { ROUTE_POLICY_KEY } from '../auth.constants';
import { ERoutePolicies } from '../enums/route-policies.enum';

export const SetRoutePolicy = (userRole: ERoutePolicies) => {
  return SetMetadata(ROUTE_POLICY_KEY, userRole);
};
