import { Controller, Get } from '@nestjs/common';

@Controller('aboutus')
export class AboutusController {
    @Get()
    getAboutus() {
        console.log('AboutusController is called');
        return { 
            message: 'Welcome to our platform! We are dedicated to providing high-quality educational resources and fostering a community of lifelong learners. Our mission is to make learning accessible, engaging, and effective for everyone. Thank you for being a part of our journey.' 
        };
    }
}
