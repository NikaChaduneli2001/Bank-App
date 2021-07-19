@Post/api/v1/users/registration - For Users
{
	fullName: string,
	email: string,
	password: string,
  personalNumber: number,
  accountNumber: string, 
}

@Role.Admin
@Get/api/v1/users/ for admin
{
	// sort
	// searchBy
	// pagination
}

@Get/api/v1/users/findUser (for user to find personalNumber) 
{
      // where userRole = user
	// searchBy personalNumber 
	
}  ? 


@Put/api/v1/users/userId
{
	    //to update properties 
      //Is not allowed to change personalNumber and accountNumber (UNIQUE)  
}

@Delete/api/v1/users/userId
{
	//deleted = true;
}


@Get/api/v1/users/transactions
{
     //we get userId from jwt token
     //sort
     //searchBy
     //pagination
}

@Get/api/v1/users/accounts
{
     //we get userId from jwt token
     //sort
     //searchBy
     //pagination
}
