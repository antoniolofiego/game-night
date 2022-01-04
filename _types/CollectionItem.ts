export interface CollectionItem {
	$: $;
	name?: NameEntity[] | null;
	yearpublished?: string[] | null;
	image?: string[] | null;
	thumbnail?: string[] | null;
	status?: StatusEntity[] | null;
	numplays?: string[] | null;
	comment?: string[] | null;
}
export interface $ {
	objecttype: string;
	objectid: string;
	subtype: string;
	collid: string;
}
export interface NameEntity {
	_: string;
	$: $1;
}
export interface $1 {
	sortindex: string;
}
export interface StatusEntity {
	$: $2;
}
export interface $2 {
	own: string;
	prevowned: string;
	fortrade: string;
	want: string;
	wanttoplay: string;
	wanttobuy: string;
	wishlist: string;
	preordered: string;
	lastmodified: string;
}
