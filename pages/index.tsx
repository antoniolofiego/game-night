import Head from 'next/head';

const Home: React.FC = () => {
	return (
		<>
			<Head>
				<title>GameNight</title>
				<meta
					name='description'
					content='The easy way to organize your board game nights'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<h1>GameNight</h1>
			</main>
		</>
	);
};

export default Home;
