import React from 'react';
import { useRouter } from 'next/navigation';
// https://viclafouch.github.io/mui-otp-input/docs/api-reference/
import { MuiOtpInput } from 'mui-one-time-password-input';

export default function VerificationBox() {
    const router = useRouter();
    const [otp, setOtp] = React.useState('')

    const handleChange = (newValue) => {
        setOtp(newValue)
    }

    const handleComplete = (value) => {
        router.push('/home');
        let code = Number(value);
    };

    const handleValidateChar = (value, index) => {
        let matchIsNumeric  = function(text) {
            const isNumber = typeof text === 'number';
            const isString = typeof text === 'string';
            return (isNumber || (isString && text !== '')) && !isNaN(Number(text));
        };

        return matchIsNumeric(value);
    };

    return (
        <MuiOtpInput length={4} value={otp} onChange={handleChange} onComplete={handleComplete}
            validateChar={handleValidateChar}
            TextFieldsProps={{ size: 'small' }}
            justifyContent="center"
            />
    );
}