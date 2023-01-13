import { IReport } from '@/interfaces/IReport';
import { ITrip, ITripStartInputDTO } from '@/interfaces/ITrip';
import { ReportService } from '@/services/reportService';
import { TripService } from '@/services/tripService';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import { INextFunction, IRequest, IResponse } from '../types/express';
import { Result } from '../util/result';

@Service()
export class ReportController {
  protected reportServiceInstance: ReportService;
  protected logger: Logger;

  constructor(reportService: ReportService, @Inject('logger') logger: Logger) {
    this.reportServiceInstance = reportService;
    this.logger = logger;
  }

  public addFeedback = async (req: IRequest, res: IResponse, next: INextFunction) => {
    this.logger.debug('Calling add feedback endpoint with query %o', req.body);

    try {
      const reportId = req.body.reportId as IReport['_id'];
      const feedback = req.body.feedback as IReport['userFeedback'];

      const report = await this.reportServiceInstance.takeFeedback(reportId, feedback);
      return res.status(200).json(Result.success(report));
    } catch (e) {
      this.logger.error('🔥 error: %o', e);
      return next(e);
    }
  };
}
