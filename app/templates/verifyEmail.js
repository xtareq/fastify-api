exports.template = ({ receiver, company }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Static Template</title>

      </head>
      <body style="background-color: gray;
      font-family: sans-serif;">
        <div style="            display: flex;
        justify-content: center;
        align-items: center;
        min-height: 480px;">
          <div style="            max-width: 375px;
          padding: 16px;
          background-color: white;
          box-shadow: 0px 2px 4px gray;
          border-radius: 20px;">
            <h1>Hi ${receiver.name},</h1>
            <p>
              Welcome to ${company.name}. Your verification code is down below:
            </p>
            <p style="font-weight: bold;
            font-size: 24px;
            color: white;
            background-color: teal;
            padding: 10px;
            text-align: center;
            box-shadow: 0px 2px 4px gray;
            border-radius: 20px;">${receiver.verify_code}</p>
            <p>
              If you face any problem please contact
              <a href="mailto:info@saxon.com">info@saxon.com</a>
            </p>
            <p>
              Thanks,<br />
              Saxon Team
            </p>
          </div>
        </div>
      </body>
    </html>
    
    `;
};
