import { ITrip, ITripStartInputDTO } from '@/interfaces/ITrip';
import { Service } from 'typedi';
import TripModel from '@/models/trip';

@Service()
export class TripRepository {
  constructor() {}

  public findTripWithUserInfo = async (tripId: ITrip['_id']) => {
    try {
      const docs = await TripModel.aggregate([
        {
          $match: {
            _id: tripId,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $unwind: '$users',
        },
        {
          $addFields: {
            weightTrash: '$weightKG',
            heightCM: '$users.heightCM',
            dob: '$users.dob',
            weightPerson: '$users.weightKG',
            gender: '$users.gender',
          },
        },
        {
          $project: {
            users: 0,
            weightKG: 0,
          },
        },
      ]);
      if (!docs || docs.length == 0) return null;
      return docs[0];
    } catch (e) {
      throw e;
    }
  };

  public getAllTripsForUser = async (userId: ITrip['userId']) => {
    try {
      const docs = await TripModel.find({ userId });
      if (!docs || docs.length == 0) return null;
      return docs.map(doc => doc.toObject());
    } catch (e) {
      throw e;
    }
  };

  public createTrip = async (startTripInputDTO: ITripStartInputDTO) => {
    try {
      const { userId, dustbinId, distanceMeter, source, destination } = startTripInputDTO;
      const tripRecord = await TripModel.create({
        userId,
        dustbinId,
        distanceMeter,
        source: {
          coordinates: [source.longitude, source.latitude],
        },
        destination: {
          coordinates: [destination.longitude, destination.latitude],
        },
      });
      if (tripRecord) return tripRecord.toObject();
      return null;
    } catch (e) {
      throw 'Trip cannot be created';
    }
  };

  public endTrip = async (id: ITrip['_id']) => {
    try {
      return TripModel.findOneAndUpdate({ _id: id }, { $set: { isCompleted: true } }, { new: true }, (err, doc) => {
        if (err) throw err;
        return doc.toObject();
      });
    } catch (e) {
      throw e;
    }
  };

  public addWeight = async (id: ITrip['_id'], weight: Number) => {
    try {
      return TripModel.findOneAndUpdate(
        { _id: id },
        { $set: { isDumped: true, isCompleted: true, weightKG: weight } },
        { new: true },
        (err, doc) => {
          if (err) throw err;
          return doc;
        },
      ).lean();
    } catch (e) {
      throw e;
    }
  };
}
