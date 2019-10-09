namespace :restaurant do
  desc "Pulls updated restaurant info from the API source"
  
  task pull: :environment do
    log = ActiveSupport::Logger.new('log/update_restaurants.log')
    log.info "Beginning restaurant database update"
    begin
      OpenTablePuller.pull
      OpenTablePuller.update_db
    rescue StandardError => error
      puts "Database update failed, please see the logfile at log/update_restaurants.log"
      log.error "Error executing update: #{error}"
      raise ActiveRecord::Rollback
    end
    puts "Database updated successfully"
    log.info "Database update completed successfully"
  end
end
