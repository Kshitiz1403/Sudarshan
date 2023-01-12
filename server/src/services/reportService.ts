import { IReport, IReportInputDTO } from '@/interfaces/IReport';
import { ITrip } from '@/interfaces/ITrip';
import { ReportRepository } from '@/repositories/reportRepository';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';

@Service()
export class ReportService {
  protected reportRepositoryInstance: ReportRepository;
  protected logger: Logger;

  constructor(reportRepository: ReportRepository, @Inject('logger') logger: Logger) {
    this.reportRepositoryInstance = reportRepository;
    this.logger = logger;
  }

  public generateReport = async (reportInputDTO: IReportInputDTO) => {
    this.logger.silly('Creating report record');

    try {
      const reportRecord = await this.reportRepositoryInstance.createReport({
        userId: reportInputDTO['userId'],
        tripId: reportInputDTO['tripId'],
        calories: reportInputDTO['calories'],
        'speed(KMH)': reportInputDTO['speed(KMH)'],
        'time(S)': reportInputDTO['time(S)'],
        'trash(KG)': reportInputDTO['trash(KG)'],
      });

      return reportRecord;
    } catch (e) {}
  };

  public getAllReports = async (userId: ITrip['userId']) => {
    try {
      this.logger.silly('Getting all reports for userId', userId);

      const reports = await this.reportRepositoryInstance.getAllReports(userId);

      return { reports };
    } catch (e) {
      throw e;
    }
  };

  public getReport = async (userId: ITrip['userId'], tripId: IReport['tripId']) => {
    try {
      this.logger.silly('Getting Report record for tripId', tripId);

      const reportRecord = await this.reportRepositoryInstance.getReportByTripId(tripId, userId);
      return reportRecord;
    } catch (e) {
      throw e;
    }
  };
}
