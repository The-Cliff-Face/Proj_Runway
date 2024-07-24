import React from 'react';
import { useRouter } from 'next/navigation';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { AuthContext } from '../AuthContext';
import Popup from 'reactjs-popup';
import { motion } from 'framer-motion';

var bp = require('/src/app/Path.js');

export default function VerificationBox({ email }) {
    const { setToken } = React.useContext(AuthContext);
    const router = useRouter();
    const [otp, setOtp] = React.useState('');
    const [isPopupOpen, setIsPopupOpen] = React.useState(true); // Control popup visibility

    const handleChange = (newValue) => {
        setOtp(newValue);
    };

    async function handleComplete(value) {
        let code = Number(value);
        let js = JSON.stringify({ email: email, code: code });

        const response = await fetch(
            bp.buildPath('api/verify_email'),
            {
                method: 'POST',
                body: js,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        let res = JSON.parse(await response.text());

        if (res.error === "") {
            router.push('/signin');
        } else {
            console.log(res.error);
            setIsPopupOpen(true); // Reopen popup on error
        }
    }

    const handleValidateChar = (value, index) => {
        let matchIsNumeric = function (text) {
            const isNumber = typeof text === 'number';
            const isString = typeof text === 'string';
            return (isNumber || (isString && text !== '')) && !isNaN(Number(text));
        };

        return matchIsNumeric(value);
    };

    return (
        <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
            <motion.div
                initial={{ opacity: 0, y: -60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div 
                    style={{ 
                        padding: '2vw', 
                        backgroundColor: 'black',
                        width: '30vw',
                        height: '12vw',
                        overflowY: 'auto', 
                        color: 'white',
                        boxShadow: '0px 0px 70vw rgba(188, 113, 223, 0.6)',
                        border: '2px solid rgba(188, 113, 223, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        //justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <p>Please enter the code that was send to your email</p>
                    <MuiOtpInput 
                        length={4} 
                        value={otp} 
                        onChange={handleChange} 
                        onComplete={handleComplete}
                        validateChar={handleValidateChar}
                        TextFieldsProps={{ size: 'small' }}
                        justifyContent="center"
                    />
                </div>
            </motion.div>
        </Popup>
    );
}
