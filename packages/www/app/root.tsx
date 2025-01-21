import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { Button } from "./components/ui/button";
import { themeSessionResolver } from "./sessions.server";
import {
  PreventFlashOnWrongTheme,
  Theme,
  ThemeProvider,
  useTheme,
} from "remix-themes";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { getTheme } = await themeSessionResolver(request);

  return {
    theme: getTheme(),
  };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");

  return (
    <ThemeProvider
      specifiedTheme={data?.theme as Theme}
      themeAction="/action/set-theme"
    >
      <InnerLayout ssrTheme={Boolean(data?.theme)}>{children}</InnerLayout>
    </ThemeProvider>
  );
}

function InnerLayout({
  ssrTheme,
  children,
}: {
  ssrTheme: boolean;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useTheme();

  return (
    <html lang="en" className={theme === Theme.DARK ? "dark" : ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="overflow-hidden">
        <nav className="h-12 bg-primary text-primary-foreground">
          <div className="container flex h-full w-full items-center justify-between px-4 sm:px-0">
            <Link to="/" className="font-semibold text-lg">
              FilmRover
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="flex h-4 w-4 dark:hidden" />
                  <Moon className="hidden h-4 w-4 dark:flex" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setTheme(Theme.LIGHT)}>
                  <Sun className="mr-2 size-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setTheme(Theme.DARK)}>
                  <Moon className="mr-2 size-4" />
                  Dark
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
        <div className="flex h-screen flex-col">
          <main className="flex flex-1 flex-col overflow-auto">{children}</main>
        </div>
        <ScrollRestoration />
        <Scripts />
        <PreventFlashOnWrongTheme ssrTheme={ssrTheme} />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
