export interface BGGBoardGame {
	$: BoardGameClass;
	thumbnail: string[];
	image: string[];
	name: NameElement[];
	description: string[];
	yearpublished: ValueElement[];
	minplayers: ValueElement[];
	maxplayers: ValueElement[];
	poll: PollElement[];
	playingtime: ValueElement[];
	minplaytime: ValueElement[];
	maxplaytime: ValueElement[];
	minage: ValueElement[];
	link: LinkElement[];
	statistics: StatisticElement[];
}

export interface BoardGameClass {
	type: string;
	id: string;
}

export interface LinkElement {
	$: Link;
}

export interface Link {
	type: string;
	id: string;
	value: string;
}

export interface ValueElement {
	$: Value;
}

export interface Value {
	value: string;
}

export interface NameElement {
	$: Name;
}

export interface Name {
	type: string;
	sortindex: string;
	value: string;
}

export interface PollElement {
	$: Poll;
	results: PollResult[];
}

export interface Poll {
	name: string;
	title: string;
	totalvotes: string;
}

export interface PollResult {
	$?: Purple;
	result: ResultResult[];
}

export interface Purple {
	numplayers: string;
}

export interface ResultResult {
	$: Fluffy;
}

export interface Fluffy {
	value: string;
	numvotes: string;
	level?: string;
}

export interface StatisticElement {
	$: Statistic;
	ratings: Rating[];
}

export interface Statistic {
	page: string;
}

export interface Rating {
	usersrated: ValueElement[];
	average: ValueElement[];
	bayesaverage: ValueElement[];
	ranks: RatingRank[];
	stddev: ValueElement[];
	median: ValueElement[];
	owned: ValueElement[];
	trading: ValueElement[];
	wanting: ValueElement[];
	wishing: ValueElement[];
	numcomments: ValueElement[];
	numweights: ValueElement[];
	averageweight: ValueElement[];
}

export interface RatingRank {
	rank: RankRank[];
}

export interface RankRank {
	$: Rank;
}

export interface Rank {
	type: string;
	id: string;
	name: string;
	friendlyname: string;
	value: string;
	bayesaverage: string;
}
