export const revalidate = false; // Server Side Generation // no need to revalidate the page
export const dynamic = 'force-static'; // SSG layout


export default async function AboutUs() {
    // fetch data from the database
    const data = await fetch('http://localhost:3000/aboutus', {
        method: 'GET', // optional, since GET is default
         });
      
      if (!data.ok) {
        throw new Error('Failed to fetch aboutus');
      }
      
      const aboutus = await data.json();
      
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1>About Us</h1>
          <p>{aboutus.message}</p>
        </div>
      );
      
}