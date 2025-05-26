package com.hospital.santajoana;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SantajoanaApplication {

	public static void main(String[] args) {
		SpringApplication.run(SantajoanaApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(ApplicationContext ctx) {

		return args -> {
			//to clear the console
			System.out.print("\033[H\033[2J");
			System.out.println("Application started!");

			String[] beanNames = ctx.getBeanDefinitionNames();

			System.out.println("Total number of beans: " + beanNames.length);
			// ajeitando a merda que fiz
			// Paciente paciente =
			//  new Paciente(
			// 	"Miguel", "53604042801", LocalDate.now(), StatusPaciente.INTERNADO
			// 	);
			// try {
			// 	pacienteMediator.save(paciente);
			// } catch (IllegalArgumentException e) {
			// 	System.out.println("Paciente não encontrado.");
			// }

			// System.out.println("Paciente salvo com sucesso!");
			// System.out.println("Nome: " + paciente.getNome());

			// Quarto quarto = new Quarto();
			// quarto.setNumero(101);
			// quarto.setTipo("Enfermaria");
			// quartoMediator.save(quarto);
			// System.out.println("Quarto salvo com sucesso!");

		};
	}
}
