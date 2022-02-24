const {
	createClub,
	deleteClub,
	getAllClubs,
	getClub,
	editClub,
} = require('./club_controller');

const fs = require('fs');

const express = require('express');
const PORT = 8080;
const app = express();

const exphbs = require('express-handlebars');
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const multer = require('multer');
const upload = multer({ dest: 'public/uploads/img' });

app.use(express.static(`public`));

app.get('/', (req, res) => {
	res.render('new_club', {
		layout: 'document',
	});
});

app.post('/', upload.single('crest'), (req, res) => {
	createClub(req);
	res.redirect('/clubs');
});

app.get('/clubs', (req, res) => {
	const clubs = getAllClubs();
	res.render('all_clubs', {
		layout: 'document',
		data: {
			clubs,
			clubsLength: clubs.length,
		},
	});
});

app.get('/clubs/:id', (req, res) => {
	const club = getClub(req);
	club['last-updated'] = club['last-updated'].match(/\d+-\d+-\d+(?=T)/);
	club.tla = club.tla.toUpperCase();
	res.render('club_detail', {
		layout: 'document',
		data: {
			club,
			color1: club.colors[0],
			color2: club.colors[1],
		},
	});
});

app.get('/clubs/delete/:id', (req, res) => {
	deleteClub(req);
	res.redirect('/clubs');
});

app.get('/clubs/edit/:id', (req, res) => {
	const club = getClub(req);
	res.render('edit_club', {
		layout: 'document',
		data: {
			club,
			color1: club.colors[0],
			color2: club.colors[1],
		},
	});
});

app.post('/clubs/edit/:id', upload.single('crest'), (req, res) => {
	editClub(req);
	res.redirect(`/clubs/${req.params.id}`);
});

app.listen(process.env.PORT || PORT);
console.log(`Listening on http://localhost:${PORT}`);
