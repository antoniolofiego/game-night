export interface BoardGame {
	$: GameClass;
	thumbnail: string[];
	image: string[];
	name: NameElement[];
	description: string[];
	yearpublished: PlayerElement[];
	minplayers: PlayerElement[];
	maxplayers: PlayerElement[];
	poll: PollElement[];
	playingtime: TimeElement[];
	minplaytime: TimeElement[];
	maxplaytime: TimeElement[];
	minage: AgeElement[];
	link: LinkElement[];
}

export interface GameClass {
	type: GameType;
	id: string;
}

export enum GameType {
	Boardgame = 'boardgame',
	Boardgameexpansion = 'boardgameexpansion',
}

export interface LinkElement {
	$: Link;
}

export interface Link {
	type: DetailType;
	id: string;
	value: string;
	inbound?: string;
}

export enum DetailType {
	Boardgameartist = 'boardgameartist',
	Boardgamecategory = 'boardgamecategory',
	Boardgamecompilation = 'boardgamecompilation',
	Boardgamedesigner = 'boardgamedesigner',
	Boardgameexpansion = 'boardgameexpansion',
	Boardgamefamily = 'boardgamefamily',
	Boardgameimplementation = 'boardgameimplementation',
	Boardgameintegration = 'boardgameintegration',
	Boardgamemechanic = 'boardgamemechanic',
	Boardgamepublisher = 'boardgamepublisher',
}

export interface PlayerElement {
	$: Players;
}

export interface Players {
	value: string;
}

export interface YearElement {
	$: Year;
}

export interface Year {
	value: string;
}

export interface AgeElement {
	$: Age;
}

export interface Age {
	value: string;
}

export interface TimeElement {
	$: Time;
}

export interface Time {
	value: string;
}

export interface NameElement {
	$: Name;
}

export interface Name {
	type: NameType;
	sortindex: string;
	value: string;
}

export enum NameType {
	Alternate = 'alternate',
	Primary = 'primary',
}

export interface PollElement {
	$: Poll;
	results: PollResult[];
}

export interface Poll {
	name: NameEnum;
	title: Title;
	totalvotes: string;
}

export enum NameEnum {
	LanguageDependence = 'language_dependence',
	SuggestedNumplayers = 'suggested_numplayers',
	SuggestedPlayerage = 'suggested_playerage',
}

export enum Title {
	LanguageDependence = 'Language Dependence',
	UserSuggestedNumberOfPlayers = 'User Suggested Number of Players',
	UserSuggestedPlayerAge = 'User Suggested Player Age',
}

export interface PollResult {
	$?: NumPlayerType;
	result: ResultResult[];
}

export interface NumPlayerType {
	numplayers: string;
}

export interface ResultResult {
	$: ResultType;
}

export interface ResultType {
	value: string;
	numvotes: string;
	level?: string;
}
