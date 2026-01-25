import React from "react";

export type DonutProps = {
    main: number;
    secondary?: number;
    total: number;
    size?: number;
    thickness?: number;
    color?: string;
    secondaryColor?: string;
    track?: string;
    center?: React.ReactNode;
};