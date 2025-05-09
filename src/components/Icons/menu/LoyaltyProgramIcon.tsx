interface LoyaltyProgramIconProps {
    size?: number;
    className?: string;
}


const LoyaltyProgramIcon = ({
    size = 20,
    className = "fill-gray-600 dark:fill-white"
}:
    LoyaltyProgramIconProps) => {
    return (
        <div>
            <svg
                width={size}
                height={size}
                viewBox="0 0 23.43 23.43"
                className={className}
                xmlns="http://www.w3.org/2000/svg"
            >      <g id="Layer_1-2" data-name="Layer 1">
                    <g>
                        <path d="M0,12.02c0-.97.02-1.95,0-2.92-.03-1.01.35-1.79,1.21-2.31,1.1-.68,2.2-1.34,3.31-2,.61-.37,1.23-.73,1.85-1.07,1.11-.61,2.24-.63,3.35,0,1.46.82,2.9,1.66,4.34,2.51.41.24.79.55,1.17.83.59.44.86,1.05.87,1.77,0,2.15,0,4.31,0,6.46,0,.75-.29,1.37-.92,1.82-.42.3-.83.61-1.26.87-1.38.81-2.76,1.62-4.15,2.41-1.14.65-2.31.65-3.45-.01-1.41-.81-2.82-1.62-4.21-2.44-.4-.24-.78-.53-1.16-.81C.31,16.63.02,15.99.01,15.21c0-1.06,0-2.13,0-3.19,0,0,0,0,0,0ZM5.88,14.43c-.01.4.45.73.91.56.3-.11.59-.24.88-.36.26-.11.52-.11.78,0,.29.12.58.24.88.35.48.18.94-.17.9-.68-.03-.32-.04-.63-.07-.95-.02-.26.05-.48.22-.67.21-.25.43-.51.63-.77.32-.4.14-.93-.35-1.06-.31-.08-.61-.16-.92-.23-.25-.06-.44-.19-.58-.4-.17-.27-.35-.54-.53-.82-.29-.46-.87-.46-1.16,0-.17.27-.35.54-.53.82-.13.21-.32.34-.56.4-.31.07-.61.15-.92.23-.53.14-.7.68-.34,1.1.19.23.38.47.58.69.2.23.28.49.25.79-.03.31-.04.61-.07,1Z" />
                        <path d="M14.12,4.42c-.48-.28-.91-.52-1.34-.77-.76-.44-1.51-.9-2.28-1.31-1.64-.89-3.29-.89-4.92.02-1.12.63-2.22,1.29-3.33,1.93-.07.04-.14.07-.22.12-.07-1.1-.12-2.17.6-3.09C3.38.37,4.35-.07,5.57,0c.47.03.94.01,1.41.01,1.12,0,2.24,0,3.36,0,.47,0,.95,0,1.4.11,1.39.36,2.34,1.6,2.38,3.03.01.4,0,.8,0,1.26Z" />
                    </g>
                </g>
            </svg>
        </div>
    )
}

export default LoyaltyProgramIcon
