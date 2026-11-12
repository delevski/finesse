// BEFORE: no pending state, no guard, no error path, page reloads.

export function ContactForm() {
  return (
    <form action="/api/contact" method="post" className="flex flex-col gap-2">
      <input name="name" placeholder="Name" className="border p-2 rounded" />
      <input name="email" placeholder="Email" className="border p-2 rounded" />
      <button className="bg-blue-500 text-white p-2 rounded">Send</button>
    </form>
  );
}
