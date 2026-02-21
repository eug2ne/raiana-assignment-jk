import InputBox from "./components/InputBox";

// TODO: create a way to temporarily store the dialogue data on the frontend side
// TODO: display TextBox using user message + chat response data

export default function Home() {
  return (
    <main>
      <div className="header">
        <h1>Raiana Assignment - JK</h1>
      </div>
      <div>
        <InputBox/>
      </div>
    </main>
  );
}
