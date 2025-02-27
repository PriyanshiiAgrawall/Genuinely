import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { buttonVariants } from '@/components/ui/button';

interface QRCodeGeneratorProps {
    url: string;
}
//Changing a ref does not trigger a re-render.
//it is used to access dom directly like query selector etc
//it returns the current value
function QRCodeGenerator({ url }: QRCodeGeneratorProps) {
    const qrRef = useRef<HTMLDivElement | null>(null);

    function downloadQRCode(e: any) {
        e.preventDefault();
        //acessing current value stored which will point to div, in div we have canvas element
        const canvas = qrRef.current?.querySelector('canvas');
        if (canvas) {
            const imageURL = canvas.toDataURL('image/png');//gives png base64 string
            const link = document.createElement('a'); // Create anchor tag
            link.href = imageURL; //this anchor tag will have href attribute pointing to png base64 url
            link.download = 'qr-code.png';//Sets filename
            link.click(); //Trigger Download
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <Dialog>
                <DialogTrigger className={buttonVariants({
                    variant: 'default',
                    size: 'lg',
                    className: 'w-full font-sans relative'
                })} >Show QR Code</DialogTrigger>
                <DialogContent className='p-4'>
                    <DialogHeader>
                        <DialogTitle>Your QR Code has been generated!</DialogTitle>
                        <DialogDescription>
                            Share this QR code with your clients to get testimonials.
                        </DialogDescription>
                    </DialogHeader>
                    {/* qrRef.current points to this <div>.*/}
                    <div ref={qrRef} className="mb-4">
                        {/* this creates canvas element internally */}
                        <QRCodeCanvas value={url} size={256} />
                    </div>
                    <button
                        onClick={downloadQRCode}
                        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-all duration-200"
                    >
                        Download QR Code
                    </button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default QRCodeGenerator;