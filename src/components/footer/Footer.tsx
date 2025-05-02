import React from 'react';
import {Box, Typography, Link} from '@mui/material';

const Footer: React.FC = () => {
    return (
        <Box sx={{
            backgroundColor: 'background.default',
            color: 'primary.main',
            padding: '20px',
            textAlign: 'center',
        }}>
            <Typography variant="body2">
                © {new Date().getFullYear()} HireTrack |
                <Link href={"/privacy"} color="inherit" underline="always"
                      sx={{marginLeft: '5px'}}>
                    Polityka prywatności
                </Link>
            </Typography>
        </Box>
    );
};

export default Footer;
