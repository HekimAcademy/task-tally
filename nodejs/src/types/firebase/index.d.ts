type RefreshTokenReqOutput = {
	expires_in: number;
	token_type: string;
	refresh_token: string;
	id_token: string;
	user_id: string;
	project_id: string;
};

export { RefreshTokenReqOutput };
