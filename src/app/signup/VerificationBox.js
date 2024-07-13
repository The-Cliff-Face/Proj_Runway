import React from 'react';
import { useRouter } from 'next/navigation';
// https://viclafouch.github.io/mui-otp-input/docs/api-reference/
import { MuiOtpInput } from 'mui-one-time-password-input';

var bp = require('/src/app/Path.js');

export default function VerificationBox({ email }) {
    const router = useRouter();
    const [otp, setOtp] = React.useState('')

    const handleChange = (newValue) => {
        setOtp(newValue)
    }

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
            router.push('/home');
        } else {
            console.log(res.error);
        }
    };

    const handleValidateChar = (value, index) => {
        let matchIsNumeric = function (text) {
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