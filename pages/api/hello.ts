// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import Sendgrid from '@sendgrid/mail';
import Mailgen from 'mailgen';

const API_KEY = process.env.SENDGRID_KEY ||
    '[INSERT API KEY HERE]';

Sendgrid.setApiKey(API_KEY);

const mailgen = new Mailgen({
    theme: 'default',
    product: {
        name: 'Covalence',
        link: 'https://covalence.io',
    },
});

type Data = {
    success: boolean;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'POST') {
        const body = req.body || {};
        const intro = body.intro || '';
        const content = body.content || '';
        const email = {
            body: {
                name: body.name || 'Customer',
                intro,
                outro: content,
            },
        };

        try {
            await Sendgrid.send({
                to: body.to,
                from: {
                    name: 'Covalence',
                    email: 'valaxo8737@kkoup.com',
                },
                subject: body.subject || 'Email',
                text: mailgen.generatePlaintext(email),
                html: mailgen.generate(email),
            });

            res.status(200).json({ success: true });
        } catch (e) {
            res.status(500).json({ success: false });
        }

        return;
    }

    res.status(404).json({ success: false });
}
