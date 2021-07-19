
**USERS API**
@Post/api/v1/users/registration - For Admin
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

@Get/api/v1/users/UsersPersonalNumber (for user to find personalNumber) 
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
**SERVICE API**

@Role.Admin
@Post/api/v1/service/ - create new service for admin
{
	serviceName: string,
	serviceType: enum,
}


@Get/api/v1/services/ 
{      
      //where deleted === false 
	// sort
	// searchBy
	// pagination

     }
}



@Role.Admin
@Patch/api/v1/service/:serviceId
{     

	//to update properties 
     
   
}


@Role.Admin
@Delete/api/v1/service/:serviceId
{     
      
	//to delete service, deleted = true;
}
**ACCOUNT API**
@Role.Admin
@Post/api/v1/accounts/ - create new account for admin
{
	accountNumber: string,
	cardCode: number,
	balance: number, 
        user: number, 
}


@Role.Admin
@Get/api/v1/accounts/ 
{      
      //where deleted === false 
	// sort
	// searchBy
	// pagination

     }
}





@Role.Admin
@Delete/api/v1/account/:accountId
{     
      
	//to delete existing account, deleted = true;
	
}

