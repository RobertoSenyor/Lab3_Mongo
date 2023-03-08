import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { LinksCollection } from '../api/links';
import { BankAccountsCollection } from '../api/bankaccounts';


// export const Info = () => {
//   const links = useTracker(() => {
//     return LinksCollection.find().fetch();
//   });

//   return (
//     <div>
//       <h2>Learn Meteor!</h2>

//       <table>
//       <tbody>
//         <tr>
//           <th>| number_of_account |</th>
//           <th> date_open |</th>
//           <th> date_close |</th>
//         </tr>
//         <tr>
//           <td>{links.map(link => 
//           <p key={link._id}> {link.title} </p>
//         )}</td>
//         </tr>
//         <tr>
//           <td>nigga2</td>
//         </tr>
//         <tr>
//           <td>nigga3</td>
//         </tr>
//       </tbody>
//       </table>
//     </div>
//   );
// };


export const Info = () => {
  const bankaccounts = useTracker(() => {
    return BankAccountsCollection.find().fetch();
  });

  return (
    <div>
      <table>
      <tbody>
        <tr>
          <th>| number_of_account |</th>
          <th> date_open |</th>
          <th> date_close |</th>
        </tr>
        <tr>
          <td>{bankaccounts.map(bankaccount => 
          <p key={bankaccounts._id}> {bankaccounts.date_open} </p>
        )}</td>
        </tr>
        <tr>
          <td>nigga2</td>
        </tr>
        <tr>
          <td>nigga3</td>
        </tr>
      </tbody>
      </table>
    </div>
  );
};
