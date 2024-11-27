import '../styles/globals.css'; 

function Header({ title }) {
  return <h1>{title ? title : 'Default title'}</h1>;
}
 
export default function HomePage() {
 
  return (
    <div>
      <p>https://bellevuec-my.sharepoint.com/:f:/g/personal/xiao_xu_bellevuecollege_edu/EowmicS0-TxKvJTe5LieMekB7wU4mrN6nX-9GopjYFQbMg?e=kDTqfw</p>
      <Header title="Hello world!" />
      <p> This is a WIP personal website belonging to Xiao (Michael) Xu. I'm working on getting React and Next.js figured out so it's just going to be this for now.</p>
      <p>LinkedIn: <a href="https://www.linkedin.com/in/ximixu">linkedin.com/in/ximixu</a></p>
      <p>GitHub: <a href="https://github.com/ximixu">github.com/ximixu</a></p>

    </div>
  );
}