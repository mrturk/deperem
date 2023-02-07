/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Button, OutlinedInput, Stack, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import PhoneInput from "react-phone-number-input";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const keys = ["acil", "destek", "yardım", "help", "ambulans", "imdat", "kurtarın", "yardım edin"]
const numbers = ["112", "155", "156", "110"]

const Acil = () => {
    const [phone, setPhone] = useState()
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const helpFunction = useCallback(() => {
        keys.forEach(element => {
            if (transcript.toLocaleLowerCase().includes(element.toLocaleLowerCase())) {
                window.location.href = `tel:112`
                resetTranscript()
            } if (transcript.toLocaleLowerCase().includes("konum")) {
                window.location.href = `https://wa.me/+9${phone}/?text=https://www.google.com/maps/search/${coords.latitude},${coords.longitude}`;
            }

        });
    }, [transcript])

    useEffect(() => {
        SpeechRecognition.startListening({ continuous: true })
        if (transcript.length > 0) {
            helpFunction()

        }
    }, [helpFunction, transcript])


    return !isGeolocationAvailable ? (
        <div>Your browser does not support Geolocation</div>
    ) : !isGeolocationEnabled ? (
        <div>Geolocation is not enabled</div>
    ) : coords ? (
        <Stack gap="10px">
            <Stack>
                        <Typography variant="h3">Konumumu Paylaş Diye Bağırın yada Acil Diye Bağırın</Typography>
            </Stack>
            <Stack>
                <OutlinedInput type="number" value={phone} onChange={(e) => {
                    setPhone(e.target.value)
                }} placeholder="konum paylaşmak istediğin telefon numarasını gir" />
            </Stack>

            <Stack>
                <Button variant="contained" onClick={() => {
                            window.open(`https://wa.me/+9${phone}/?text=https://www.google.com/maps/search/${coords.latitude},${coords.longitude}`)
                }}>Konum Paylaş</Button>
            </Stack>
            <Stack gap="10px">
                {numbers.map((item, index) => {
                    return (
                        <Button variant="contained" key={index} onClick={() => {
                            window.location.href = `tel:${item}`

                        }}>
                            {item}
                        </Button>
                    )
                })}
            </Stack>

        </Stack>
    ) : (
        <div>Getting the location data&hellip; </div>
    );
};

export default Acil;