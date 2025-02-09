import { DoubleAuthentification } from '../entities/DoubleAuthentification';
import { Utilisateur } from '../entities/Utilisateur';
import { createTransport } from 'nodemailer';
import { renderFile } from 'ejs';

export class EmailService {

    private transporter = createTransport({
        service: 'gmail',
        auth: {
            user: 'andyrdn04@gmail.com',
            pass: 'dugb spty aqoy napx',
        },
    });

    private subjects = [
        'Validation de votre profil',
        'Authentification de votre profil',
        'Reinitialisation du nombre d\'essaie de connexion',
    ];

    private paths = [
        './view/validation.html.ejs',
        './view/confirmation.html.ejs',
        './view/reset.html.ejs',
    ];

    async createMail(recept: string, subject: string, uid: number): Promise<void> {
        const index = this.subjects.indexOf(subject);
        if (index === -1) throw new Error('Invalid subject');

        let pin = 0;
        if(subject === 'Authentification de votre profil') {
            pin = await this.generatePIN(uid)
        }

        const html = await renderFile(this.paths[index], { codePin: pin, uid: uid });

        const email = {
            from: 'Connectify <andyrdn04@gmail.com>',
            to: recept,
            subject,
            html,
        };

        await this.transporter.sendMail(email);
    }

    async generatePIN(id: number): Promise<number> {
        const pin = Math.floor(100000 + Math.random() * 900000);

        const authe = new DoubleAuthentification();
        authe.utilisateur = await Utilisateur.findOneBy({ id });
        authe.daty = new Date();
        authe.code = pin;
        await authe.save();

        return pin;
    }
}