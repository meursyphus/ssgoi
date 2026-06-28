import {
  createHandler,
  StartServer,
  type DocumentComponentProps,
} from "@solidjs/start/server";

function Document(props: DocumentComponentProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="A SolidStart SSR template showcasing SSGOI page transitions."
        />
        <title>SSGOI Demo - SolidStart Template</title>
        {props.assets}
      </head>
      <body>
        <div id="app">{props.children}</div>
        {props.scripts}
      </body>
    </html>
  );
}

export default createHandler(() => <StartServer document={Document} />);
