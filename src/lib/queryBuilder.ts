const queryBuilder = (queryObject: any = {}, keyForId = '') => {
	let query: any = {},
		{
			segment = '',
			category_id = null,
			branch_id = null,
			brand_id = null,
			status = '',
			id = null,
			cashier_name = '',
			category_status = null,
			end_shift_id = 0,
			cashier_id = ''
		} = queryObject;

	if (segment) {
		query[segment] = true;
	}

	if (branch_id) {
		query.branch_id = branch_id;
	}

	if (brand_id) {
		query.brand_id = brand_id;
	}

	if (category_id) {
		query.category_id = category_id;
	}

	if (id && keyForId) {
		query[keyForId] = id;
	}

	if (category_status) {
		query.category_status = true;
	}

	if (cashier_name) {
		query.cashier_name = cashier_name;
	}
	if (end_shift_id) {
		query.end_shift_id = end_shift_id;
	}
	if (status) {
		query.status = status;
	}
	if (cashier_id) {
		query.cashier_id = cashier_id;
	}

	return query;
};

export { queryBuilder };
