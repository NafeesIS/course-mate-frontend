interface ThriveStackScriptProps {
  thriveStackApiKey: string;
}

export default function ThriveStackScript({
  thriveStackApiKey,
}: ThriveStackScriptProps) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
          <script
            src='https://ts-script.app.thrivestack.ai/latest/thrivestack.js'
            api-key='${thriveStackApiKey}'
            source='marketing,product'
            defer>
          </script>
        `,
      }}
    />
  );
}
