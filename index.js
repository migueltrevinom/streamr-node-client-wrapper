
/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.mainFunctioin = async (req, res) => {
    const config = require('./config');
  
    const {
      eth_address,
      authUser,
      action,
      MAT_KEY,
    } = req.body;
  
    if (MAT_KEY !== config.streamr.MATKey) {
      res.status('409').send('MAT_KEY does not match');
    }
  
    if (!eth_address) {
      res.status(409).send('eth_address is missing');
    }
  
    const Streamr = require('./streamr');
  
    const isProvider = Boolean(authUser && authUser.providerId);
  
    const dataUnion = isProvider ? Streamr.getAmbassadorDataUnion() : Streamr.getUserDataUnion();
  
    let memberResponse = null;
  
    switch (action) {
      case 'exit':
        memberResponse = await Streamr.partMembers(dataUnion, [eth_address]);
        
        break;
      case 'join': 
        memberResponse = await Streamr.addMembers(dataUnion, [eth_address]);
  
        break;
      case 'isMember':
        memberResponse = await Streamr.isMember(dataUnion, eth_address);
  
        break;
      case 'memberStats':
        memberResponse = await Streamr.getMemberStats(dataUnion, eth_address);
        
        break;
    }
  
    res.status(memberResponse.status).send(memberResponse);
  };
  