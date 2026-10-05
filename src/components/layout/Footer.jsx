export default function Footer(){
    return(
        <footer className="px-(--gutter) py-4">
            <div className="text-center flex flex-col md:flex-row justify-between text-primary">
                <span className="text-sm text-primary font-sans">© 2026 Giovanni Criscuolo — Italy</span>
                <span className="text-sm text-primary font-sans">Built with React and Tailwind CSS</span>
            </div>     
        </footer>
    );
}