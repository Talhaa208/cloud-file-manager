import Navbar from "./components/Navbar";
import Link from 'next/link'; 


export default function Home() {
    return (
        <div className="home-page">
            <Navbar />
            <div className="hero-section">
                <h1 className="hero-title">Welcome to Cloud File Manager</h1>
                <p className="hero-description">Your files, securely stored in the cloud. Access them anytime, anywhere.</p>
                <div className="cta-buttons">
                    <Link href="/register">
                        Get Started
                    </Link>
                    <Link href="/login">
                Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
