class ErrorResponse {
	constructor(error) {
		this.error = error;
	}
}

class StatusResponse {
	constructor(status, user = undefined) {
		this.status = status;
		if (user !== undefined) {
			this.user = user instanceof User ? user : new User(user);
		}
	}
}

class User {
	constructor(row) {
		this.id = row.id;
		this.email = row.email;
		this.is_email_verified = row.is_email_verified;
		this.balance_sol = row.balance_sol !== undefined ? parseFloat(row.balance_sol) : 0;
		this.created_at = row.created_at;
	}
}

class LoginResponse {
	constructor(message, user) {
		this.message = message;
		this.user = user instanceof User ? user : new User(user);
	}
}

class Charity {
	constructor(row) {
		this.id = row.id;
		this.name = row.name;
		this.description = row.description;
		this.link = row.link;
		this.logo_url = row.logo_url;
		this.wallet_address = row.wallet_address;
		this.created_at = row.created_at;
	}
}

class CharityTotal {
	constructor(row) {
		this.market_charity_id = row.market_charity_id;
		this.charity_id = row.charity_id;
		this.total_sol = row.total_sol;
	}
}

class Market {
	constructor(row) {
		this.id = row.id;
		this.title = row.title;
		this.description = row.description;
		this.image_url = row.image_url;
		this.status = row.status;
		this.type = row.type;
		this.time_length_s = row.time_length_s;
		this.winning_share = row.winning_share;
		this.created_at = row.created_at;
		this.total_sol = row.total_sol;

		const charities = row.charity_totals;
		if (Array.isArray(charities)) {
			this.charity_totals = charities.map((c) => new CharityTotal(c));
		} else if (typeof charities === "string") {
			this.charity_totals = JSON.parse(charities).map((c) => new CharityTotal(c));
		} else {
			this.charity_totals = [];
		}
	}
}

class Share {
	constructor(row) {
		this.id = row.id;
		this.user_id = row.user_id;
		this.market_id = row.market_id;
		this.market_charity_id = row.market_charity_id;
		this.amount_sol = row.amount_sol;
		this.seen_result = row.seen_result;
		this.created_at = row.created_at;
		this.username = row.username;
		this.avatar_url = row.avatar_url;
	}
}

class ProfileResponse {
	constructor(username, avatar_url, shares) {
		this.username = username;
		this.avatar_url = avatar_url;
		this.shares = (shares || []).map((s) => new Share(s));
	}
}

class ProfileUpdateResponse {
	constructor(message, profile) {
		this.message = message;
		this.profile = profile;
	}
}

class SearchUserResponse {
	constructor(row) {
		this.user_id = row.user_id;
		this.username = row.username;
		this.avatar_url = row.avatar_url;
	}
}

class UsernameAvailableResponse {
	constructor(available) {
		this.available = available;
	}
}

class BalanceResponse {
	constructor(balance) {
		this.balance = balance;
	}
}

class Deposit {
	constructor(row) {
		this.id = row.id;
		this.user_id = row.user_id;
		this.amount_sol = row.amount_sol;
		this.transaction_signature = row.transaction_signature;
		this.status = row.status;
		this.created_at = row.created_at;
	}
}

class DepositResponse {
	constructor(message, amount) {
		this.message = message;
		this.amount = amount;
	}
}

class LeaderboardEntry {
	constructor(row) {
		this.user_id = row.user_id;
		this.username = row.username;
		this.avatar_url = row.avatar_url;
		this.total_donated = row.total_donated;
	}
}

class WinEntry {
	constructor(row) {
		this.share_id = row.share_id;
		this.amount_sol = row.amount_sol;
		this.created_at = row.created_at;
		this.username = row.username;
		this.avatar_url = row.avatar_url;
		this.market_title = row.market_title;
	}
}

class ConfigResponse {
	constructor(pool_wallet_address) {
		this.pool_wallet_address = pool_wallet_address;
	}
}

class BlockhashResponse {
	constructor(blockhash) {
		this.blockhash = blockhash;
	}
}

module.exports = {
	ErrorResponse,
	StatusResponse,
	User,
	LoginResponse,
	Charity,
	CharityTotal,
	Market,
	Share,
	ProfileResponse,
	ProfileUpdateResponse,
	SearchUserResponse,
	UsernameAvailableResponse,
	BalanceResponse,
	Deposit,
	DepositResponse,
	LeaderboardEntry,
	WinEntry,
	ConfigResponse,
	BlockhashResponse
};
