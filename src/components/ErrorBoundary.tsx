import { Component, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main id="main-content" className="container max-w-2xl py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Diçka shkoi keq
          </h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Na vjen keq, por ndodhi një gabim i papritur. Ju lutemi provoni përsëri.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="bg-primary text-primary-foreground font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Rifresko faqen
            </button>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false })}
              className="text-primary font-medium hover:underline"
            >
              Kthehu në ballina
            </Link>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
