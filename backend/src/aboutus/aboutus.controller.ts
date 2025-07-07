import { Controller, Get } from '@nestjs/common';

@Controller('aboutus')
export class AboutusController {
    @Get()
    getAboutus() {
        console.log('AboutusController is called');
        return { 
            message: "Our mission is to provide a user-friendly and efficient way for movie lovers to book their favorite seats at their favorite cinemas. We believe in the power of stories and the magic of the big screen, and we want to make it accessible to everyone."
    }
}}
