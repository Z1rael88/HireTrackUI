import type { Roles } from "./enums";
import React from "react";

export type ProfileUser = {
  name: string;
  email?: string;
  initials?: string;
  company?: string;
};

export type ProfileMenu = {
  role: Roles;
  user: ProfileUser;
  onLogout?: () => void;
  onNavigate?: (path: string) => void;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
  onOpenCV?: () => void;
  onOpenHrJobs?: () => void;
  onCreateJob?: () => void;
  size?: number;
};

export type Props = ProfileMenu & {
  onClose: () => void;
};

export type TileProps = {
  icon: React.ElementType;
  label: string;
  sub?: string;
  onClick?: () => void;
  autoFocus?: boolean;
  subtitle?: string;
};