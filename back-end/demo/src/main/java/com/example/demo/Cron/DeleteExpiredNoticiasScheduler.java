package com.example.demo.Cron;

import com.example.demo.models.Noticia;
import com.example.demo.repositories.NoticiaRepo;
import com.example.demo.services.CentroService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DeleteExpiredNoticiasScheduler {

    private static final Logger logger = LoggerFactory.getLogger(CentroService.class.getName());

//    @Scheduled(cron = "${cron.expression}")
//    public void scheduleTaskDeleteExpiredNoticias() {
//        long now = System.currentTimeMillis() / 1000;
//        logger.info("now: {}", now);
//    }

    @Autowired
    private NoticiaRepo noticiaRepo;

    @Scheduled(cron = "${cron.expression}")
    @Transactional
    public void scheduleTaskDeleteExpiredNoticiasWithDelay() {

        logger.info("Buscando los id's de las noticias expiradas...");

        LocalDateTime fechaLimite = LocalDateTime.now().minusDays(30);
        List<Long> expiredNoticias = noticiaRepo.findIdsByFechaCreacionBeforeNative(fechaLimite);

        logger.info("Los id's de las noticias expiradas son: {}", expiredNoticias);

        for (Long id : expiredNoticias) {
            try {
                noticiaRepo.deleteById(id);
                logger.info("Se elimino la noticia con ID {}", id);
                // Agregar delay aquí
                Thread.sleep(1000); // Pausa de 1 segundo (ajusta según sea necesario)
            } catch (InterruptedException | DataIntegrityViolationException e) {
                // Manejar excepciones (por ejemplo, loggear, notificar)
                logger.error("Error al eliminar noticia con ID {}", id, e);
            }
        }
    }

}
